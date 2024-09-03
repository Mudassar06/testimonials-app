import React, { useState } from 'react';

interface TestimonialModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, email: string, rating: number, content: string, contentType: string) => void;
}

const TestimonialModal: React.FC<TestimonialModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [content, setContent] = useState('');
    const [contentType, setContentType] = useState<'text' | 'video'>('text');
    const [name, setName] = useState('');
    const [email, setEmail] = useState(''); //Validate email
    const [rating, setRating] = useState<number>(1); // Default rating

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSubmit(name, email, rating, content, contentType);
        setContent('');
        setContentType('text');
        setName('');
        setEmail('');
        setRating(5); 
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-card p-6 rounded shadow-lg">
                <h2 className="text-lg font-bold mb-4 text-foreground">Submit Testimonial</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 text-foreground">Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border border-border rounded p-2 w-full bg-input text-foreground"
                            placeholder="Your Name"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-foreground">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-border rounded p-2 w-full bg-input text-foreground"
                            placeholder="Your Email"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-foreground">Rating:</label>
                        <select
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            className="border border-border rounded p-2 w-full bg-input text-foreground"
                        >
                            {[1, 2, 3, 4, 5].map((rate) => (
                                <option key={rate} value={rate}>{rate}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-foreground">Content Type:</label>
                        <select
                            value={contentType}
                            onChange={(e) => setContentType(e.target.value as 'text' | 'video')}
                            className="border border-border rounded p-2 w-full bg-input text-foreground"
                        >
                            <option value="text">Text</option>
                            <option value="video">Video</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-foreground">Content:</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="border border-border rounded p-2 w-full bg-input text-foreground"
                            placeholder="Enter your testimonial here"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button type="button" onClick={onClose} className="mr-2 bg-gray-300 p-2 rounded">Cancel</button>
                        <button type="submit" className="bg-primary text-primary-foreground p-2 rounded">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TestimonialModal;