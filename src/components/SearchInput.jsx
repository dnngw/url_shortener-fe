import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

/*
* Search Input
*
* Input with search icon and a clear (x) button when it has value
* */
function SearchInput({ value, onChange, onClear, className, ...props }) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        // Esc clears the search
        onKeyDown={(e) => e.key === 'Escape' && value && onClear()}
        className="pl-8 pr-8 [&::-webkit-search-cancel-button]:hidden"
        {...props}
      />
      {value && (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute top-1/2 right-1.5 -translate-y-1/2"
        >
          <X />
        </Button>
      )}
    </div>
  )
}

export default SearchInput
