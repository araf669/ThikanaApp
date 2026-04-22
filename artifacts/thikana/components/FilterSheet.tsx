import React, { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

import { AMENITIES_LONG, AMENITIES_STAY, DHAKA_AREAS } from "@/constants/data";
import { Filters } from "@/context/AppProviders";
import { useColors } from "@/hooks/useColors";

import { Button, Chip, Input } from "./UI";

export function FilterSheet({
  visible,
  onClose,
  initial,
  onApply,
  mode = "rent",
}: {
  visible: boolean;
  onClose: () => void;
  initial: Filters;
  onApply: (f: Filters) => void;
  mode?: "rent" | "stay";
}) {
  const colors = useColors();
  const [draft, setDraft] = useState<Filters>(initial);

  const set = (patch: Partial<Filters>) => setDraft((d) => ({ ...d, ...patch }));

  const amenityOptions = mode === "stay" ? AMENITIES_STAY : AMENITIES_LONG;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: colors.overlay, justifyContent: "flex-end" }}>
        <View
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 22,
            borderTopRightRadius: 22,
            maxHeight: "88%",
          }}
        >
          <View style={{ alignItems: "center", paddingTop: 10 }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.borderStrong }} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", padding: 16, paddingBottom: 8 }}>
            <Text style={{ flex: 1, fontFamily: "Inter_700Bold", fontSize: 18, color: colors.foreground }}>
              Filters
            </Text>
            <Pressable onPress={() => setDraft({ sort: "newest" })}>
              <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium" }}>Reset</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16, gap: 18, paddingBottom: 32 }}>
            <Section title="Area">
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {DHAKA_AREAS.map((a) => (
                  <Chip
                    key={a}
                    label={a}
                    active={draft.area === a}
                    onPress={() => set({ area: draft.area === a ? undefined : a })}
                  />
                ))}
              </View>
            </Section>

            <Section title={mode === "stay" ? "Price per night (৳)" : "Monthly rent (৳)"}>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Input
                    placeholder="Min"
                    keyboardType="numeric"
                    value={draft.minPrice ? String(draft.minPrice) : ""}
                    onChangeText={(t) =>
                      set({ minPrice: t ? Number(t.replace(/[^0-9]/g, "")) : undefined })
                    }
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Input
                    placeholder="Max"
                    keyboardType="numeric"
                    value={draft.maxPrice ? String(draft.maxPrice) : ""}
                    onChangeText={(t) =>
                      set({ maxPrice: t ? Number(t.replace(/[^0-9]/g, "")) : undefined })
                    }
                  />
                </View>
              </View>
            </Section>

            {mode === "rent" ? (
              <>
                <Section title="Property type">
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    {(["flat", "room", "sublet", "house"] as const).map((t) => (
                      <Chip
                        key={t}
                        label={t.charAt(0).toUpperCase() + t.slice(1)}
                        active={draft.type === t}
                        onPress={() => set({ type: draft.type === t ? undefined : t })}
                      />
                    ))}
                  </View>
                </Section>

                <Section title="Bedrooms">
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {[1, 2, 3, 4].map((n) => (
                      <Chip
                        key={n}
                        label={`${n}+`}
                        active={draft.rooms === n}
                        onPress={() => set({ rooms: draft.rooms === n ? undefined : n })}
                      />
                    ))}
                  </View>
                </Section>

                <Section title="Bathrooms">
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {[1, 2, 3].map((n) => (
                      <Chip
                        key={n}
                        label={`${n}+`}
                        active={draft.bathrooms === n}
                        onPress={() => set({ bathrooms: draft.bathrooms === n ? undefined : n })}
                      />
                    ))}
                  </View>
                </Section>

                <Section title="Suitable for">
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    {(["family", "bachelor", "student", "couple"] as const).map((s) => (
                      <Chip
                        key={s}
                        label={s.charAt(0).toUpperCase() + s.slice(1)}
                        active={draft.suitability === s}
                        onPress={() =>
                          set({ suitability: draft.suitability === s ? undefined : s })
                        }
                      />
                    ))}
                  </View>
                </Section>
              </>
            ) : (
              <Section title="Guests">
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {[1, 2, 3, 4, 6].map((n) => (
                    <Chip
                      key={n}
                      label={`${n}+`}
                      active={draft.guests === n}
                      onPress={() => set({ guests: draft.guests === n ? undefined : n })}
                    />
                  ))}
                </View>
              </Section>
            )}

            <Section title="Furnished">
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Chip
                  label="Furnished"
                  active={draft.furnished === true}
                  onPress={() =>
                    set({ furnished: draft.furnished === true ? undefined : true })
                  }
                />
                <Chip
                  label="Unfurnished"
                  active={draft.furnished === false}
                  onPress={() =>
                    set({ furnished: draft.furnished === false ? undefined : false })
                  }
                />
              </View>
            </Section>

            <Section title="Amenities">
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {amenityOptions.map((a) => {
                  const on = draft.amenities?.includes(a) ?? false;
                  return (
                    <Chip
                      key={a}
                      label={a}
                      active={on}
                      onPress={() => {
                        const cur = draft.amenities ?? [];
                        set({
                          amenities: on
                            ? cur.filter((x) => x !== a)
                            : [...cur, a],
                        });
                      }}
                    />
                  );
                })}
              </View>
            </Section>

            <Section title="Sort">
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {([
                  ["newest", "Newest"],
                  ["lowest", "Lowest price"],
                  ["highest", "Highest price"],
                ] as const).map(([k, label]) => (
                  <Chip
                    key={k}
                    label={label}
                    active={draft.sort === k}
                    onPress={() => set({ sort: k })}
                  />
                ))}
              </View>
            </Section>
          </ScrollView>

          <View
            style={{
              padding: 16,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              flexDirection: "row",
              gap: 10,
            }}
          >
            <View style={{ flex: 1 }}>
              <Button label="Cancel" variant="ghost" fullWidth onPress={onClose} />
            </View>
            <View style={{ flex: 1.4 }}>
              <Button
                label="Apply filters"
                fullWidth
                onPress={() => {
                  onApply(draft);
                  onClose();
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const colors = useColors();
  return (
    <View style={{ gap: 10 }}>
      <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: colors.foreground }}>
        {title}
      </Text>
      {children}
    </View>
  );
}
