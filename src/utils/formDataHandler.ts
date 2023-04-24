import multer, {DiskStorageOptions, Options} from 'multer'
import {Request} from "express";

type OptionalMulterOptions = Partial<Options>

const defaultFilenameGenerator = (req: Request, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) => {
    callback(null, file.originalname + '-' + Date.now() + "." + file.originalname.split('.').pop())
}

const generateStorage = ({ destination, filename }: DiskStorageOptions) => {
    return multer.diskStorage({
        destination,
        filename: filename ?? defaultFilenameGenerator
    })
}

const createMulter = (multerOptions: OptionalMulterOptions = { dest: 'uploads' }) => {
    const options: Options = {
        storage: generateStorage({ destination: multerOptions.dest }),
        ...multerOptions
    }
    return multer(options)
}

export default createMulter
