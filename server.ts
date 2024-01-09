import { JSX } from "react"

export type Opts = {
}
export type NakedOpts = { [key: string]: any }

export interface Server<T extends Opts> {
    /**
     * Creates a response to a request.
     *
     * @param request The {@link Request `Request`} to respond to.
     * @param opts See {@link Opts `RouteOpts`}
     * @param naked_opts An object exposing any configuration options provided to functions called by this one, with
     * the corresponding function pointers as the keys.
     */
    serve: (request: Request, opts?: T, naked_opts?: NakedOpts) => Promise<Response>
}
