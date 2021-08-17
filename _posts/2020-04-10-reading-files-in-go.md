---
layout: post
title: 3 ways to read files in Go
---

> A quick reference for reading files in Go.

### 1. Simple file reading

For a simple file reading, let's say when you just want to read it into a variable, you can use the `ioutil` library. The code blow demonstrates this.

```go
import "io/ioutil"

func main() {
  data, err := ioutil.ReadFile("foo.txt");

  if err != nil {
    return // error
  }

  // store data in a string
  var text string = string(data);
}
```

### 2. Byte sized pieces

Another common way to read files in are in bite sized pieces. You would use this technique if your file is so large that reading it all in at once would be very very slow or crash your program. This is often known as streaming in data.

```go
import (
  "os"
  "bufio"
)

func main() {
  f, err := os.Open("foo.txt")
  if err != nil {
    // err
  }

  defer f.Close()

  r := bufio.NewReader(f)
  b := make([]byte, 4) // size of chunk

  finalString = ""

  for {
    n, err := r.Read(b)
    if err != nil {
      break
    }

    finalString += string(b[0:n])
  }
}
```

