# bitbucket-cli

To install dependencies:

```bash
bun install
```

Configure a token in the `.env` file

```javascript
BITBUCKET_ACCESS_TOKEN=<Token>
```

To clone a repo:

```bash
bun clone
```

To trigger a pipeline for a branch:

```bash
bun pipelines:create
```

To get the pipeline status for a branch:

```bash
bun pipelines:status
```

To trigger an existing pipeline for a repo:

```bash
bun pipelines:retry
```
