import React from 'react';

export function UserImage({ user, width=32, height=32 }) {
  if(!user) return null;

  return (
    <img
      width={width}
      height={height}
      className='mr-3'
      src={user.photoURL}
      alt={user.displayName}
      style={{ borderRadius: '5px' }}
    />
  );
}
