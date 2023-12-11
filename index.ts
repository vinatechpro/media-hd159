import { Elysia, t } from "elysia"
import staticPlugin from "@elysiajs/static"
import {v4 as uuidv4} from 'uuid'
import sharp from "sharp"
import slugify from "@sindresorhus/slugify"
import fs from 'fs'
import { isKeyObject } from "util/types"
import { nextTick } from "process"

const imageSize = [
    { key: 'sm', value : 640 },
    { key: 'md', value : 768 },
    { key: 'lg', value : 1024 },
    { key: 'xl', value : 1280 }
]

var mediaURL = 'http://localhost:3366/'

const app = new Elysia()

.get("/", () => {
    let welcome = {
        status: 200,
        url: 'https://media.mmohub.io/images'
    }
    return JSON.stringify(welcome)
})

.onError(({ code, error, set }) => {
    if (code === 'NOT_FOUND') {
        set.status = 404
        return '404 - Not Found'
    }
})


.post('/upload', async ({ body: {files} }) => {

    var data = [];

    for (const file of files) {
        let pathStorage = 'images'; 
        let uuidImage = uuidv4();
        let nameImage = slugify(file.name);
        let dirPath = pathStorage + "/" + uuidImage;
        let fullPathStorage = dirPath + "/" + nameImage + ".png";

        var subData = [];

        try {
            await fs.promises.mkdir(dirPath, { recursive: true });
        } catch (err) {
            console.error(err);
            return;
        }

        try {
            await Bun.write(fullPathStorage, file);
        } catch (err) {
            console.error(err);
            return;
        }
        
        subData.push({
            size: 'orignal',
            url: mediaURL + fullPathStorage
        });

        for (const is of imageSize) {
            const isImageName = dirPath + "/" + nameImage + '-' + is.key + '.png';
            try {
                await sharp(fullPathStorage)
                    .resize({ width: is.value })
                    .toFile(isImageName);
            } catch (err) {
                console.error(err);
                return;
            }
            
            subData.push({
                size: is.key,
                url: mediaURL + isImageName
            });
        }
        
        data.push(subData);

    }

    return JSON.stringify(data);

},
{
    body: t.Object({
        files: t.Files({
            type: ['image'],
            maxItems: 10,
            maxSize: 5 * 1024 * 1024
        })
    })
})


// Handle /images/abcxyz return 404 - Not Found 
.get('/images/:id', (set) =>{
    set.status = 404
    return '404 - Not Found'
})

.listen(3366);

// Config use static asset - prefix '/images' is mean url: localhost:3366/images/* 
app.use(staticPlugin({
    assets: "images",
    prefix: "images",
    alwaysStatic: false,
    ignorePatterns: ['/images/**/','.DS_Store', '.git', '.env'],
    noExtension: false,
}))

console.log(
  `🦊 Service is running at ${app.server?.hostname}:${app.server?.port}`
)