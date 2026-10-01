"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { demoActions } from "@/lib/store";
import type { Company, NeedCategory, NeedType, Profile } from "@/lib/types";

const CATEGORIES: Record<NeedType, NeedCategory[]> = {
  discussion: ["Technical question", "Referral request", "Software", "Code & permitting", "Product & materials"],
  hiring: ["Hiring", "Seeking subcontractor", "Seeking consultant", "Seeking work", "Available for freelance"],
};

const inputClass =
  "h-11 w-full rounded-lg border border-input bg-background px-2.5 text-base outline-none md:h-9 md:text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40";

export function NeedComposer({
  viewer,
  company,
  type,
  onDone,
}: {
  viewer: Profile;
  company: Company | null;
  type: NeedType;
  onDone: () => void;
}) {
  const [category, setCategory] = useState<NeedCategory>(CATEGORIES[type][0]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [location, setLocation] = useState(viewer.location);
  const [tags, setTags] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    demoActions.addNeed({
      author_profile_id: viewer.id,
      company_id: company?.id ?? null,
      need_type: type,
      category,
      title: title.trim(),
      body: body.trim(),
      location: location.trim() || viewer.location,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 6),
    });
    onDone();
  }

  return (
    <form onSubmit={submit} className="rounded-xl bg-card p-4 ring-1 ring-brand/40 md:p-5" aria-label={type === "hiring" ? "Post an opening" : "Ask the industry"}>
      <h3 className="font-heading text-base font-semibold">
        {type === "hiring" ? "Post an opening or availability" : "Ask the industry"}
      </h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground sm:col-span-2">
          Title
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder={type === "hiring" ? "Senior Estimator, healthcare group" : "Precedent for a detail, a referral, a product question"} />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value as NeedCategory)} className={inputClass}>
            {CATEGORIES[type].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          Location
          <input value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground sm:col-span-2">
          Details
          <textarea required value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="w-full rounded-lg border border-input bg-background px-2.5 py-2 text-base outline-none md:text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40" placeholder="What do you need, what have you already tried, and what would a good answer look like?" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground sm:col-span-2">
          Tags, comma separated
          <input value={tags} onChange={(e) => setTags(e.target.value)} className={inputClass} placeholder="CLT, Fire rating, SF DBI" />
        </label>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onDone}>Cancel</Button>
        <Button type="submit" size="sm" disabled={!title.trim() || !body.trim()}>
          {type === "hiring" ? "Post opening" : "Post question"}
        </Button>
      </div>
    </form>
  );
}
