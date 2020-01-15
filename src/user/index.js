import React from 'react';

export function UserImage({ user, photoUrl, displayName, width=32, height=32 }) {
  if(!user && !(photoUrl && displayName)) return null;

  return (
    <img
      width={width}
      height={height}
      className='mr-3'
      src={user?.photoURL || photoUrl}
      alt={user?.displayName || displayName}
      style={{ borderRadius: '5px' }}
    />
  );
}
