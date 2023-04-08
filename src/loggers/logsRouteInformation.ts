import {Request, Response} from "express";

const routeLogger = (req: Request, res: Response, next: any) => {
    console.log('ROUTE-LOGGER:: We\'ll like to know about the routes')
    next()
}

export default routeLogger