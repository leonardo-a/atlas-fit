import { LucideProps } from 'lucide-react'
import React from 'react'

export type RequestStatus = 'success' | 'pending' | 'failed' | 'idle'

export type LucideIcon = React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>
