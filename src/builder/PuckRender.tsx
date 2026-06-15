'use client'

import { Render } from '@measured/puck'

import { config } from './puck.config'

/** Renders published Puck page data on the public site. */
export function PuckRender({ data }: { data: unknown }) {
  return <Render config={config} data={data as never} />
}

export default PuckRender
