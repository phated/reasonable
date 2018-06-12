package module

import (
	"fmt"
	"io/ioutil"
	"log"
	"path/filepath"
	"strings"
)

type Module struct {
	fileType          string
	identifier        string
	interfacePath     *string
	interfaceContents []byte
	sourcePath        *string
	sourceContents    []byte
	wrappedContents   string
	compiledContents  *string
}

func NewFromFilepath(sourcePath string) *Module {
	_, filename := filepath.Split(sourcePath)
	ext := filepath.Ext(sourcePath)
	var fileType string
	var interfacePath string

	identifier := strings.Title(strings.TrimSuffix(filename, ext))

	// TODO: select/case
	if ext == ".re" {
		fileType = "reason"
		interfacePath = sourcePath + "i"
	}

	if ext == ".ml" {
		fileType = "ocaml"
		interfacePath = sourcePath + "i"
		log.Fatalln("no support for .ml yet")
	}

	if ext == ".js" {
		fileType = "javascript"
		log.Fatalln("no support for .js yet")
	}

	return &Module{
		fileType:      fileType,
		identifier:    identifier,
		sourcePath:    &sourcePath,
		interfacePath: &interfacePath,
	}
}

func CombineModules(modules []*Module) []byte {
	//TODO: dependency resolution?
	out := []byte{}
	for _, mod := range modules {
		contents := mod.GetContents()
		out = append(out, contents...)
	}

	return out
}

func (m *Module) GetIdentifier() string {
	return m.identifier
}

func (m *Module) Load() error {
	if err := m.LoadInterface(); err != nil {
		return err
	}

	if err := m.LoadSource(); err != nil {
		return err
	}

	m.WrapContents()

	return nil
}

func (m *Module) LoadSource() error {
	if contents, err := ioutil.ReadFile(*m.sourcePath); err != nil {
		return err
	} else {
		m.sourceContents = contents
	}

	return nil
}

func (m *Module) LoadInterface() error {
	if m.interfacePath == nil {
		return nil
	}

	if contents, err := ioutil.ReadFile(*m.interfacePath); err != nil {
		// Ignore failure to load interface
		m.interfacePath = nil
	} else {
		m.interfaceContents = contents
	}

	return nil
}

func (m *Module) WrapContents() {
	if m.sourceContents == nil {
		return
	}

	// TODO: Interface files
	moduleWrapper := `module %s = { %s };`

	m.wrappedContents = fmt.Sprintf(moduleWrapper, m.identifier, m.sourceContents)
}

func (m *Module) GetContents() []byte {
	return []byte(m.wrappedContents)
}
