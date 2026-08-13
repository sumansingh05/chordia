"use client";

import type { Track } from "@/lib/types";
import { useLibrary } from "@/context/LibraryContext";
import Dropdown from "@/components/Dropdown";
import PlaylistPicker from "@/components/PlaylistPicker";
import { HeartFilledIcon, HeartIcon, MoreIcon } from "@/components/icons";

type TrackMenuProps = {
  track: Track;
};

export default function TrackMenu({ track }: TrackMenuProps) {
  const { isLiked, toggleLike } = useLibrary();
  const liked = isLiked(track.id);

  return (
    <Dropdown
      triggerClassName="flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 transition-colors hover:text-white"
      panelWidth={260}
      align="end"
      trigger={(open) => (
        <MoreIcon className={`h-4 w-4 ${open ? "text-white" : ""}`} />
      )}
    >
      {(close) => (
        <div className="p-1.5">
          <button
            type="button"
            onClick={() => {
              toggleLike(track);
              close();
            }}
            className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm text-neutral-200 transition-colors hover:bg-white/10"
          >
            {liked ? (
              <HeartFilledIcon className="h-4 w-4 shrink-0 text-accent" />
            ) : (
              <HeartIcon className="h-4 w-4 shrink-0" />
            )}
            {liked ? "Remove from Liked Songs" : "Save to Liked Songs"}
          </button>
          <div className="my-1 h-px bg-white/10" />
          <PlaylistPicker tracks={[track]} onDone={close} />
        </div>
      )}
    </Dropdown>
  );
}