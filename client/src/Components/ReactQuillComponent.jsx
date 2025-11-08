import React, { useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import '../reactQuill.scss';

// 1. Define the whitelist for Quill (must match the names used in SCSS)
const CUSTOM_FONT_NAMES = [
  'CascadiaCode',
  'GoogleSansCode',
  'IBMPlexMono',
  'Lato',
  'MontserratAlternates',
  'Raleway',
  'Roboto',
  'Rubik',
  'Sixtyfour',
  'SofiaSans',
];

// 2. Register the custom fonts with Quill
const Font = Quill.import('formats/font');
Font.whitelist = CUSTOM_FONT_NAMES; // Set the whitelist
Quill.register(Font, true); // Register the new format

const ReactQuillComponent = ({
  value,
  onChange,
  className = '',
  modules,
  formats,
  ...props
}) => {
  // 3. Define the Quill modules, including the font dropdown (default)
  const defaultModules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ font: CUSTOM_FONT_NAMES }], // <--- Use the font names here
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [
            { list: 'ordered' },
            { list: 'bullet' }, // This is correct for the toolbar
          ],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ align: [] }],
          ['link', 'image', 'video'],
          ['clean'],
        ],
        // Optional: You can add custom handlers here if needed
      },
    }),
    []
  );

  // 4. Define the formats prop (must include 'font') (default)
  const defaultFormats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'direction',
    'list',
    'indent',
    'align',
    'link',
    'image',
    'video',
  ];

  const finalModules = modules || defaultModules;
  const finalFormats = formats || defaultFormats;

  return (
    <ReactQuill
      theme='snow'
      value={value}
      onChange={onChange}
      modules={finalModules}
      formats={finalFormats}
      className={className}
      {...props}
    />
  );
};

export default ReactQuillComponent;
