import React, { useState, useEffect } from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Volume2, VolumeX } from "lucide-react";
import { getSystemVolume, isSystemMuted } from '@/lib/sounds';

interface SystemTrayProps {
  onCloseAllWindows?: () => void;
}

export const SystemTray = ({ onCloseAllWindows }: SystemTrayProps) => {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [volume, setVolume] = useState(getSystemVolume() * 100);
  const [isMuted, setIsMuted] = useState(isSystemMuted());
  const [date, setDate] = useState<Date>(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = formatInTimeZone(currentTime, 'America/Los_Angeles', 'h:mm a');
  const formattedDate = format(currentTime, 'EEEE, MMMM d, yyyy');

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    
    // Update system mute state through event
    window.dispatchEvent(
      new CustomEvent('muteChange', { detail: { muted: newMuted } })
    );
  };

  const handleVolumeChange = (vals: number[]) => {
    const newVolume = vals[0];
    setVolume(newVolume);
    
    // Update system volume through event
    window.dispatchEvent(
      new CustomEvent('volumeChange', { detail: { volume: newVolume } })
    );
    
    // Also handle mute state
    if (newVolume === 0 && !isMuted) {
      setIsMuted(true);
      window.dispatchEvent(
        new CustomEvent('muteChange', { detail: { muted: true } })
      );
    } else if (newVolume > 0 && isMuted) {
      setIsMuted(false);
      window.dispatchEvent(
        new CustomEvent('muteChange', { detail: { muted: false } })
      );
    }
  };

  return (
    <div className="flex items-center h-full bg-gradient-to-b from-blue-600 to-blue-700 px-2 space-x-4">
      <Dialog>
        <DialogTrigger>
          <img 
            src="/images/81a0b106-411f-496c-825d-e7b2780de055.png" 
            alt="Info" 
            className="w-4 h-4 opacity-80 hover:opacity-100 cursor-pointer"
          />
        </DialogTrigger>
        <DialogContent className="fixed bg-[#ECE9D8] rounded shadow-vista-window animate-window-open border border-[#0054E3] w-[600px] p-0">
          <div className="h-8 bg-gradient-to-r from-[#0054E3] to-[#2E8AEF] rounded-t flex items-center justify-between px-2">
            <DialogTitle className="text-white font-segoe text-sm">
              About This Website
            </DialogTitle>
          </div>
          <div className="h-12 bg-gradient-to-r from-[#0054E3] to-[#2E8AEF] flex items-center justify-center space-x-2">
            <img 
              src="/images/1e1aaff4-1c6b-4e96-abd5-1b10acf84ef4.png" 
              alt="Windows XP" 
              className="w-6 h-6" 
            />
            <span className="text-white font-semibold">Windows XP</span>
          </div>
          <DialogHeader className="p-6">
            <DialogDescription className="text-vista-text space-y-4">
              <p className="text-lg font-semibold text-vista-accent mb-4">
                Hey stranger! My name is BimaDev, welcome to my digital playground :D
              </p>
              <div className="space-y-2">
                <p>
                  This website is a nostalgic tribute to Windows XP, built using modern web technologies while maintaining the classic XP aesthetic. It features:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Authentic Windows XP-style UI components and interactions</li>
                  <li>Modern React and TypeScript foundation for smooth performance</li>
                  <li>Tailwind CSS for pixel-perfect styling that matches the XP look</li>
                  <li>Interactive windows system with minimize, maximize, and close functionality</li>
                </ul>
                <p className="mt-4">
                  The project aims to recreate the memorable Windows XP experience while showcasing modern web development capabilities. Every detail, from the iconic taskbar to window animations, has been carefully crafted to bring back memories of the classic operating system.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Popover>
        <PopoverTrigger asChild>
          <button 
            className="flex items-center justify-center hover:bg-blue-500/30 rounded p-1"
            onClick={(e) => e.stopPropagation()}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-white" />
            ) : (
              <Volume2 className="h-4 w-4 text-white" />
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-80 p-4 bg-[#ECE9D8] border border-gray-400 shadow-md"
          align="end"
          alignOffset={-40}
        >
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Volume</h4>
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleMute}
                className="hover:bg-gray-200 p-1 rounded"
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="flex-1"
              />
            </div>
            <div className="text-right text-sm">
              {isMuted ? 'Muted' : `${volume}%`}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <img 
            src="/images/44648c88-ab69-48f2-a16d-1030d28af09e.png" 
            alt="Close" 
            className="w-4 h-4 opacity-80 cursor-pointer hover:opacity-100"
          />
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-[#ECE9D8] border-[#0054E3]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#0054E3]">Close All Windows</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to close all open windows? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#ECE9D8] hover:bg-[#DCE9D8] border-[#0054E3]">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onCloseAllWindows}
              className="bg-[#0054E3] hover:bg-[#2E8AEF] text-white"
            >
              Close All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex items-center space-x-2 text-white border-l border-blue-500 pl-4 cursor-pointer hover:bg-blue-500/30 rounded px-2">
            <span className="text-sm">{formattedTime}</span>
          </div>
        </DialogTrigger>
        <DialogContent className="fixed bg-[#ECE9D8] rounded shadow-vista-window animate-window-open border border-[#0054E3] w-[400px] p-0">
          <div className="h-8 bg-gradient-to-r from-[#0054E3] to-[#2E8AEF] rounded-t flex items-center justify-between px-2">
            <DialogTitle className="text-white font-segoe text-sm">
              Date and Time Properties
            </DialogTitle>
          </div>
          <div className="p-4">
            <div className="flex flex-col space-y-4">
              <div className="text-center text-lg font-semibold">
                {formattedDate}
              </div>
              <div className="text-center text-3xl font-bold">
                {format(currentTime, 'h:mm:ss a')}
              </div>
              <div className="border border-gray-300 p-2 rounded">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  className="mx-auto bg-white"
                />
              </div>
              <div className="flex justify-between mt-4">
                <button className="px-4 py-2 bg-[#ECE9D8] border border-gray-400 rounded hover:bg-gray-200">
                  Time Zone
                </button>
                <button className="px-4 py-2 bg-[#0054E3] text-white border border-[#0054E3] rounded hover:bg-[#2E8AEF]">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};