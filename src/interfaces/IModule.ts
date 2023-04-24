import {Express} from "express";

export default interface IModule {
    name: string
    type: ModuleType
    content: ModuleContent
    courseId: string,
    contentType: ModuleContentType
}

export type ModuleType = 'text' | 'file'
export type ModuleContentType = 'text' | FileType
export type ModuleContent = string | Express.Multer.File
