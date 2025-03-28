import { PropsWithChildren } from "react";

export type PageLayoutProps = {}

export default function PageLayout ({children} : PropsWithChildren<PageLayoutProps>) {
    return <div style={{margin: "5px", background: "yellow", height: "100%", width: "100%"}}>{children}</div>
}