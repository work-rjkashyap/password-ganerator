import React from 'react'
import { Shuffle, Lightbulb, Hash, Info } from 'lucide-react'
import { Button } from './ui/button'

const PasswordTypeTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex w-full min-w-[350px]">
      <div className="flex-1 overflow-x-auto whitespace-nowrap no-scrollbar">
        <div className="inline-flex gap-1.5 min-w-full bg-muted/40 rounded-lg p-1">
          <Button
          variant={activeTab === 'random' ? 'default' : 'ghost'}
          className={`justify-start shrink-0 rounded-md px-3 py-1.5 text-sm transition-shadow ${activeTab === 'random' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted'}`}
          onClick={() => setActiveTab('random')}
        >
          <Shuffle className="inline-block mr-2 -ml-0.5" size={14} />
          Random
          </Button>

          <Button
          variant={activeTab === 'memorable' ? 'default' : 'ghost'}
          className={`justify-start shrink-0 rounded-md px-3 py-1.5 text-sm transition-shadow ${activeTab === 'memorable' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted'}`}
          onClick={() => setActiveTab('memorable')}
        >
          <Lightbulb className="inline-block mr-2 -ml-0.5" size={14} />
          Memorable
          </Button>

          <Button
          variant={activeTab === 'pin' ? 'default' : 'ghost'}
          className={`justify-start shrink-0 rounded-md px-3 py-1.5 text-sm transition-shadow ${activeTab === 'pin' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted'}`}
          onClick={() => setActiveTab('pin')}
        >
          <Hash className="inline-block mr-2 -ml-0.5" size={14} />
          PIN
          </Button>

          <Button
          variant={activeTab === 'about' ? 'default' : 'ghost'}
          className={`justify-start shrink-0 rounded-md px-3 py-1.5 text-sm transition-shadow ${activeTab === 'about' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted'}`}
          onClick={() => setActiveTab('about')}
        >
          <Info className={`inline-block mr-2 -ml-0.5 transform transition-transform duration-150 ${activeTab === 'about' ? 'text-cyan-500 scale-110' : 'text-gray-500 hover:scale-105'}`} size={14} />
          About
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PasswordTypeTabs
