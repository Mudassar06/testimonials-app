'use client'
import React from 'react'
import { ThemeSwitcher } from './theme-switcher'
import { createClient } from '@/utils/supabase/client';
const Navigation =  () => {

    const supabase = createClient();
    return (
    <div className='w-full h-[60px] fixed top-0 left-0 px-4 bg-background border-neutral-500 border-b flex justify-between items-center z-50'>
        <h2 className='font-bold text-2xl '>Testimonial.app</h2>
        <div>

        <ThemeSwitcher/>
        </div>
    </div>
  )
}

export default Navigation