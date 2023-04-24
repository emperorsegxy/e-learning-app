import {ModuleContent, ModuleContentType} from "../../interfaces/IModule";
import {Express} from "express";

export const genContentType = (type: string): ModuleContentType => {
    if (!type) {
        return 'text'
    }
    return type.split('\/').shift()! as ModuleContentType
}

export const isContentAFile = (content: ModuleContent):  content is Express.Multer.File =>
    typeof content !== 'string' && typeof content !== "undefined" && content !== null
