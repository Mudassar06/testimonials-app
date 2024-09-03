'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import TestimonialModal from '@/components/TestimonialModal';

export default function WorkspacePage() {
    const { name } = useParams<{ name: string }>();
    const [workspace, setWorkspace] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchWorkspace = async () => {
            try {
                const response = await axios.get(`/api/testimonial/${encodeURIComponent(name)}`);
                setWorkspace(response.data);
            } catch (err) {
                setError('No workspace for testimonial found'); //find a better way to show this
            } finally {
                setLoading(false);
            }
        };

        fetchWorkspace();
    }, [name]);

    const handleTestimonialSubmit = async (name: string, email: string, rating: number, content: string, contentType: string) => {
        try {
            const response = await axios.post('/api/createTestimonial', {
                w_id: workspace.id, 
                admin: workspace.admin, 
                content_type: contentType,
                content,
                rating,
                email,
                name
            });
            console.log('Testimonial submitted:', response.data);
            //show a success message
        } catch (error) {
            console.error('Error submitting testimonial:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <div>
                <h1>Workspace Name: {workspace.w_name}</h1>
                <p>ID: {workspace.id}</p>
                <p>Admin: {workspace.admin}</p>
                <p>Title: {workspace.workspace_title}</p>
                <p>Description: {workspace.workspace_desc}</p>
            </div>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-primary text-primary-foreground font-bold py-2 px-4 rounded-md focus:outline-none hover:bg-primary/80"
            >
                Give Written Testimonial
            </button>
            <TestimonialModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleTestimonialSubmit}
            />
        </div>
    );
}