// frontend/src/components/payment/Company SearchBar.tsx
'use client';
import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [keyword, setKeyword] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    onSearch(value);
  };

  return (
    <div className='flex items-center text-black border border-gray-300 rounded-md p-1 bg-white text-[17px]'>
      <img src='/admin-dashboard/search.png' alt='検索' className='w-6 h-6 mr-1' />
      <input
        type='text'
        value={keyword}
        onChange={handleSearch}
        placeholder='検索'
        className='p-1 flex-1 border-none focus:outline-none'
      />
    </div>
  );
}
