# media-mmohub | Service upload images typescript, bun

Clone Project:

```bash
git clone https://github.com/vinatechpro/media-mmohub.git
```

To install:

```bash
bun install
```

To run:

```bash
bun --hot run index.ts
```
Change media url:

```bash
var mediaURL = 'http://localhost:3366/'
```

Change size resize storage:

```bash
const imageSize = [
    { key: 'sm', value : 640 },
    { key: 'md', value : 768 },
    { key: 'lg', value : 1024 },
    { key: 'xl', value : 1280 }
]
```

Validate Image: [File Validation - ElysiaJS|Bun](https://elysiajs.com/patterns/file-upload.html#file-validation). 

```bash
files: t.Files({
            type: ['image'],
            maxItems: 10,
            maxSize: 5 * 1024 * 1024
        })
```

API upload:

```bash
POST localhost:3366/upload
```
