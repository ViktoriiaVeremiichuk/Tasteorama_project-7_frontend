'use client';

import { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function Filters() {
  const [text, setText] = useState('hello');

  const handleChange = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setText(event.target.value),
    1000
  );

  useEffect(() => {
    console.log(`Make HTTP request with: ${text}`);
  }, [text]);

  return (
    <div>
        <h2>Recipes</h2>
      <input type="text" defaultValue={text} onChange={handleChange} />
      <p>Text value: {text}</p>
    </div>
  );
}