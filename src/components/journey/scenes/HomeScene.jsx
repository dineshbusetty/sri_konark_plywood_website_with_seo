import { useMemo } from 'react'
import { rooms } from '../../../data/rooms'
import RoomScene from './RoomScene'
import { HOME_ROOMS } from '../../../data/cameraKeyframes'

export default function HomeScene({ progressRef }) {
  const roomConfigs = useMemo(() =>
    rooms.map((room, i) => ({
      room,
      zOffset: -35 - i * 12,
      scrollRange: HOME_ROOMS[i] || { start: 0, end: 1 },
    })),
    []
  )

  return (
    <group>
      {roomConfigs.map(({ room, zOffset, scrollRange }, i) => (
        <RoomScene
          key={room.id}
          room={room}
          position={[0, 0, zOffset]}
          scrollRange={scrollRange}
          progressRef={progressRef}
          index={i}
        />
      ))}
    </group>
  )
}
