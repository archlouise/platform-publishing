"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NeedCard } from "./NeedCard";
import { NeedComposer } from "./NeedComposer";
import { useDemoState } from "@/lib/store";
import type { Company, NeedType, NeedView, Profile } from "@/lib/types";

export function NeedsBoard({
  discussion,
  hiring,
  viewer,
  viewerCompany,
  initialTab = "discussion",
}: {
  discussion: NeedView[];
  hiring: NeedView[];
  viewer: Profile;
  viewerCompany: Company | null;
  initialTab?: NeedType;
}) {
  const state = useDemoState();
  const [tab, setTab] = useState<NeedType>(initialTab);
  const [composing, setComposing] = useState(false);

  const local = (type: NeedType): NeedView[] =>
    state.needs
      .filter((n) => n.need_type === type)
      .map((need) => ({ need, author: viewer, company: viewerCompany }));

  const lists: Record<NeedType, NeedView[]> = {
    discussion: [...local("discussion"), ...discussion],
    hiring: [...local("hiring"), ...hiring],
  };

  return (
    <Tabs value={tab} onValueChange={(v) => { setTab(v as NeedType); setComposing(false); }}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <TabsList aria-label="Needs & Help sections">
          <TabsTrigger value="discussion">Open discussion</TabsTrigger>
          <TabsTrigger value="hiring">Hiring and seeking work</TabsTrigger>
        </TabsList>
        <Button size="sm" onClick={() => setComposing((v) => !v)} aria-expanded={composing}>
          <PlusIcon />
          {tab === "hiring" ? "Post an opening" : "Ask a question"}
        </Button>
      </div>

      {(["discussion", "hiring"] as NeedType[]).map((type) => (
        <TabsContent key={type} value={type} className="flex flex-col gap-4">
          {composing && tab === type ? (
            <NeedComposer viewer={viewer} company={viewerCompany} type={type} onDone={() => setComposing(false)} />
          ) : null}
          <p className="text-sm text-muted-foreground" role="status">
            {lists[type].length} {type === "hiring" ? "openings and availability posts" : "open questions"}
          </p>
          {lists[type].map((view) => (
            <NeedCard key={view.need.id} view={view} />
          ))}
        </TabsContent>
      ))}
    </Tabs>
  );
}
