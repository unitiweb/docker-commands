## Stack Commander

> Although we fell this package to already be very useful it is still in BETA

This is a simple utility you can use to run commands in your dev stack or any stack you'd like.

You simply can define commands then run those commands at a command line starting with they keyword `stack`

**Example**

```
stack start web
stack up
stack down
stack update
```

**or**

```
stack deploy remote web
```

### Install

This is a global package, so you only have to install it on your machine once.

```
npm install -g stack-commander
```

### Configure

Create a yaml file in the root of you your repo that define your commands

The basic stack.yml file must have this format

```yaml
stack:
  commands:
```

All the commands you define will be under the `commands:` node

A command can be in several forms depending on your needs.

**The most basic**

```yaml
stack:
  commands:
    mydir: echo $(pwd)
```

**With multiple commands**

```yaml
stack:
  commands:
    mydir: 
      - echo This is my current directory
      - echo $(pwd)
```

**With a description**

```yaml
stack:
  commands:
    mydir: 
      description: This will print out my current directory
      commands:
        - echo $(pwd)
        - echo There it is
```

**With a working directory**

You can specify the working directory relative to where the command is being ran

```yaml
stack:
  commands:
    mydir: 
      description: This will print out my current directory
      path: test/path
      commands:
        - echo 'this is file1' >> file1.txt
```

If the directory `test/path` exists the above command will create the file `test/path/file1.txt

**With multiple commands with multiple working directories**

Not the command keys `0`, `1`, and `2`. These are arbitrary and can be what ever you want them to be as long as they are unique to this list of commands (not unique for the entire stack.yml file)

```yaml
stack:
  commands:
    mydir: 
      description: This will print out my current directory
      commands:
        0:
          commands: mkdir newdir
        1:
          path: newdir
          commands: 
            - echo 'this is file1' >> file1.txt
            - mkdir anotherdir
        2:
          path: newdir/anotherdir
          commands:
            - echo 'this is file2' >> file2.txt
            - echo 'this is file3' >> file3.txt
```

Here's what will actually happen with this command.
1. The directory `newdir` will be created
2. A file named `file1.txt` will be created in `newdir` (`./newdir/file1.txt`)
3. A directory named `anotherdir` will be created inside the `newdir` (`./newdir/anotherdir`)
4. Files `file2.txt` and `file3.txt` will be created in the `anotherdir` directory (`./newdir/anotherdir`)

**Example**

Here is an example of a more complex `stack.yml` file with examples of different ways you can configure your commands.

```yaml
stack:
  commands:
    test:
      default: echo This is test default
      zero_a: echo This is zero_a test
    one: echo This is the most basic test
    two:
      - echo Test Two Command One
      - echo Test Two Command Two
    three:
      description: This is test three
      path: test
      commands: echo Test Three Command One
    four:
      description: This is test four
      commands:
        0:
          commands: mkdir newdir
        1:
          path: newdir
          commands: mkdir anotherdir
        2:
          path: newdir/anotherdir
          commands:
            - echo 'this is file1' >> file1.txt
            - echo 'this is file2' >> file2.txt
    five:
      description: This is test five
      path: test
      commands:
        - echo Test Five Command One
        - echo Test Five Command Two
    nested:
      default: echo Level 1
      next:
        default: echo Level 2
        next:
          default: echo Level 3
          next:
            default: echo Level 4
            next:
              default: echo Level 5
              next: echo Level 6
```

This `stack.yml` file will produce the following commands

```bash
stack test
stack one
stack two
stack three
stack four
stack five
stack nested
stack nested next
stack nested next next
stack nested next next next
stack nested next next next next
stack nested next next next next next
``` 
