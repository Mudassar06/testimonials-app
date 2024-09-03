'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

export default function WorkspacePage() {
    const { name } = useParams<{ name: string }>();
    const [workspace, setWorkspace] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchWorkspace = async () => {
            try {
                const response = await axios.get(`/api/workspaces/${encodeURIComponent(name)}`);
                setWorkspace(response.data);
            } catch (err) {
                setError('Workspace not found');
            } finally {
                setLoading(false);
            }
        };

        fetchWorkspace();
    }, [name]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <div>
                <h1>Workspace Name: {workspace.w_name}</h1>
                <p>Title: {workspace.workspace_title}</p>
                <p>Description: {workspace.workspace_desc}</p>
            </div>
            <h1>My testimonials</h1>
        </div>
    );
}