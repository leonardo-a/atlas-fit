'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import { toast } from 'sonner'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { SONNER_ERROR_STYLE } from '@/constants/sonner'
import { api } from '@/lib/axios'
import { cn } from '@/lib/utils'
import { Student } from '@/types/students'

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')
  const [students, setStudents] = React.useState<Student[]>([])

  async function fetchStudents() {
    try {
      const response = await api.get('/students')

      setStudents(response.data.students)
    } catch (err) {
      console.log(err)
      toast('Erro ao buscar alunos', SONNER_ERROR_STYLE)
    }
  }

  React.useEffect(() => {
    fetchStudents()
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? students.find((student) => student.id === value)?.name
            : 'Selecione o aluno...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {students.map((student) => (
                <CommandItem
                  key={student.id}
                  value={student.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value
                      ? ''
                      : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === student.id
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {student.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
