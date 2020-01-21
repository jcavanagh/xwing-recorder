import React from 'react';

export function UserImage({ user, photoURL, displayName, width=32, height=32 }) {
  if(!user && !(photoURL && displayName)) return null;

  return (
    <img
      width={width}
      height={height}
      className='mr-3'
      src={user?.photoURL || photoURL}
      alt={user?.displayName || displayName}
      style={{ borderRadius: '5px' }}
    />
  );
}
