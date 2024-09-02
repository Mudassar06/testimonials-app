'use client'
import React from 'react'
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client'
import axios from 'axios';
import { useRouter } from 'next/navigation'

export default function CreateWorkspace() {

    const router = useRouter();
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
  
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();


        const workspaceData = {
            w_name: name,
            workspace_title: title,
            workspace_desc: description,
        };
        
        try {
            const response = await axios.post('/api/createWorkspace', workspaceData);
            console.log('SUCCESS:', response.data);
            setName('');
            setTitle('');
            setDescription('');

            router.push(`/protected/workspace/${encodeURIComponent(name)}`);
        } catch (error) {
            console.error('ERROR:', error);
        }
    };
  
    return (
        <div className="min-h-screen flex justify-center items-center bg-background">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg p-8 bg-card shadow-md rounded-lg"
          >
            <h2 className="text-2xl font-bold mb-6 text-foreground">
              Create Workspace
            </h2>
    
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-bold mb-2 text-foreground"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-border rounded-md text-foreground bg-input placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter workspace name"
              />
            </div>
    
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-bold mb-2 text-foreground"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-border rounded-md text-foreground bg-input placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter workspace title"
              />
            </div>
    
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-bold mb-2 text-foreground"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-border rounded-md text-foreground bg-input placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter workspace description"
              />
            </div>
    
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-primary text-primary-foreground font-bold py-2 px-4 rounded-md focus:outline-none hover:bg-primary/80"
              >
                Create Workspace
              </button>
            </div>
          </form>
        </div>
      );
  
}