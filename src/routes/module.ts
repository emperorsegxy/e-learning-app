import VerifyUser from "../middleware/VerifyUser";
import {createModule, doesTypeAndContentMatch} from "../services/module";
import {JwtPayload} from "jsonwebtoken";
import {Router} from "express";
import createMulter from "../utils/formDataHandler";
import {ModuleType} from "../interfaces/IModule";
import {genContentType, isContentAFile} from "../utils/modules";
import uploadFileToCloudinary from "../utils/cloudinaryUploader";

const moduleRouter = Router()

const multerUploads = createMulter()

moduleRouter.post(`/:courseId`, VerifyUser, multerUploads.single('content'), async (req, res) => {
    try {
        let content: string = ''
        const moduleType: ModuleType = req.body.type
        if (!doesTypeAndContentMatch(req, moduleType))
            return res.status(400).send({ message: 'Content type does not match module type', status: 400 })
        const contentType = genContentType(req.file?.mimetype || req.body.type)
        if (contentType !== 'text' && !!req.file && isContentAFile(req.file)) {
            const UPLOAD_FOLDER = 'modules'
            const uploadResponse =
                await uploadFileToCloudinary({ filePath: req.file.path, fileType: contentType, folder: UPLOAD_FOLDER })
            content = uploadResponse.getUploadResponse().url
        }
        if (!content && !!req.body.content) content = req.body.content
        req.body.type = moduleType ? moduleType : 'text'
        const savedModule = await createModule({ ...req.body, content, contentType }, req.params.courseId, (req.decodedAuth as JwtPayload)?.id)
        res.status(201).send({
            message: 'Successfully created a module',
            module: savedModule
        })
    } catch (e: any) {
        res.status(500).send(e.message)
    }
})

export default moduleRouter
