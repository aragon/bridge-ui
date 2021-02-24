import Link from "next/link"

type Props = {
    children: any,
    href?: string,
    onClick?: () => any
}

export default function Button(props: Props) {
    if (props.onClick) return <div className="button accent-2" onClick={() => props.onClick()}>
        {props.children}
    </div>

    return <Link href={props.href}>
        <div className="button accent-2">
            {props.children}
        </div>
    </Link>
}
