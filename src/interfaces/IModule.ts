import {File} from "buffer";

export default interface IModule {
    name: string
    type: ModuleType
    content: ModuleContent
    courseId: string
}

type ModuleType = 'text' | 'file' | 'video' | 'audio'
type ModuleContent = string | File
