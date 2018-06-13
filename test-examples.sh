for directory in examples/*/; do
  echo "Running example: $directory"
  ./reasonable "$directory"
done
