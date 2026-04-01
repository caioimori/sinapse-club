"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface ComingSoonModalProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function ComingSoonModal({
  title = "Em breve",
  description = "Esta funcionalidade estara disponivel em breve para membros.",
  children,
}: ComingSoonModalProps) {
  return (
    <Dialog>
      <DialogTrigger render={<span className="contents" />}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Entendi
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
