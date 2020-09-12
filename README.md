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

Here is an example of a more complex `stack.yml` file with examples of different ways you can configure your commands.

**Example**

```yaml
stack:
  commands:
    init:
      description: Run to setup the complete stack
      commands:
        - git clone git@github.com:username/repo.git repos/my-app1
        - cd repos/my-app1 && npm install
        - git clone git@github.com:username/repo.git repos/my-app2
        - cd repos/my-app2 && composer install
        - export COMPOSE_INTERACTIVE_NO_CLI=1
        - docker-compose up -d
        - docker-compose exec api php artisan migrate
        - docker-compose down
    up:
      description: Spin up my stack
      commmands: docker-compose up -d
    down: docker-compose down
    migrate:
      description: Migrate database. NOTE - Stack must be running
      commands: export COMPOSE_INTERACTIVE_NO_CLI=1 && docker-compose exec my-app2 php artisan migrate
    test:
      app1:
        description: Run tests for my-app1
        commands: cd repos/my-app1 && npm run test
      app2:
        description: Run tests for my-app2
        commands: cd repos/my-app2 && npm run test
    example:
      this:
        nested:
          default:
            description: Command runs on nested
            commands: echo "Nested"
          many:
            levels:
              run: echo "this command will run"
```

This `stack.yml` file will produce the following commands

```bash
stack init
stack up
stack down
stack migrate
stack test app1
stack test app2
stack example this nested
stack example this nested many levels run
``` 
