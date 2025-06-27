"use client";

import { UseFormReturn } from "react-hook-form";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { CreatePoolType, ChainData } from "@/types/form/create-pool.type";
import { cn } from "@/lib/utils";

interface Step0ChainSelectionProps {
  form: UseFormReturn<CreatePoolType>;
  chains: ChainData[];
}

export default function Step0ChainSelection({
  form,
  chains,
}: Step0ChainSelectionProps) {
  form.watch("chainId");

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="chainId"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">
              Available Networks
            </FormLabel>
            <FormControl>
              <RadioGroup
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                value={String(field.value)}
                onValueChange={(value) => {
                  field.onChange(Number(value));
                }}
              >
                {chains.map((chain) => (
                  <div
                    key={chain.chainId}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      ref={field.ref}
                      className="peer sr-only"
                      id={`chain-${chain.chainId}`}
                      value={String(chain.chainId)}
                    />
                    <label
                      className="flex-1 cursor-pointer"
                      htmlFor={`chain-${chain.chainId}`}
                    >
                      <span className="sr-only">{chain.name}</span>
                      <Card
                        className={cn(
                          "hover:bg-accent/50 transition-colors relative border-2",
                          {
                            "border border-muted":
                              field.value !== chain.chainId,
                            "border-primary": field.value === chain.chainId,
                          },
                        )}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <Image
                                alt={chain.name}
                                className="w-12 h-12 rounded-full object-cover border"
                                height={48}
                                src={chain.icon}
                                width={48}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;

                                  target.style.display = "none";
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-sm font-semibold truncate">
                                  {chain.name}
                                </h4>
                                <Badge className="text-xs" variant="secondary">
                                  {chain.symbol}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                Chain ID: {chain.chainId}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge className="text-xs" variant="outline">
                                  Testnet
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
