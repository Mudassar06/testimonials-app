'use client'
export default function WorkSpacePage({ params }: { params: { name: string } }) {
    return <div>Workspace name: {params.name}</div>
}