import React from 'react';
const createMarkup = html => ({__html: html})
export default ({html}) => <div dangerouslySetInnerHTML={createMarkup(html)} />