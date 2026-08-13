"use client";

import type { ReactNode } from "react";
import type { Track } from "@/lib/types";
import Dropdown from "@/components/Dropdown";
import PlaylistPicker from "@/components/PlaylistPicker";
import { PlusIcon } from "@/components/icons";

type AddToPlaylistDropdownProps = {
  tracks: Track[];
  trigger: ReactNode;
  triggerClassName?: string;
  panelWidth?: number;
};

export default function AddToPlaylistDropdown({
  tracks,
  trigger,
  triggerClassName,
  panelWidth,
}: AddToPlaylistDropdownProps) {
  return (
    <Dropdown
      triggerClassName={triggerClassName}
      panelWidth={panelWidth}
      trigger={() => trigger}
    >
      {(close) => <PlaylistPicker tracks={tracks} onDone={close} />}
    </Dropdown>
  );
}

export function SaveButtonTrigger({
  label = "Save",
}: {
  label?: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <PlusIcon className="h-5 w-5" />
      {label}
    </span>
  );
}