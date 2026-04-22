import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import { AuthGate, Button, Chip, IconButton, Input } from "@/components/UI";
import { AMENITIES_LONG, AMENITIES_STAY, DHAKA_AREAS } from "@/constants/data";
import { useAuth, useListings } from "@/context/AppProviders";
import { useColors } from "@/hooks/useColors";

export default function CreateListing() {
  return (
    <AuthGate message="Sign in to post a rental or short-stay listing.">
      <CreateForm />
    </AuthGate>
  );
}

function CreateForm() {
  const colors = useColors();
  const params = useLocalSearchParams<{ kind?: string }>();
  const initialKind = params.kind === "stay" ? "stay" : "rent";
  const { addListing } = useListings();
  const { user } = useAuth();

  const [kind, setKind] = useState<"rent" | "stay">(initialKind);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"flat" | "room" | "sublet" | "house" | "studio">(
    initialKind === "stay" ? "studio" : "flat",
  );
  const [area, setArea] = useState<string>("");
  const [address, setAddress] = useState("");
  const [rent, setRent] = useState("");
  const [advance, setAdvance] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [bedrooms, setBedrooms] = useState("1");
  const [bathrooms, setBathrooms] = useState("1");
  const [balconies, setBalconies] = useState("0");
  const [drawing, setDrawing] = useState(false);
  const [dining, setDining] = useState(false);
  const [furnished, setFurnished] = useState(false);
  const [bachelor, setBachelor] = useState(false);
  const [student, setStudent] = useState(false);
  const [family, setFamily] = useState(true);
  const [couple, setCouple] = useState(false);
  const [availableFrom, setAvailableFrom] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState(user?.phone ?? "");
  const [whatsapp, setWhatsapp] = useState("");
  const [guestCapacity, setGuestCapacity] = useState("2");
  const [minStay, setMinStay] = useState("1");
  const [amenities, setAmenities] = useState<string[]>([]);

  const amenityOptions = kind === "stay" ? AMENITIES_STAY : AMENITIES_LONG;

  const valid = useMemo(() => {
    if (!title.trim() || !area || !address.trim() || !contact.trim()) return false;
    if (kind === "rent" && !rent) return false;
    if (kind === "stay" && !pricePerNight) return false;
    return true;
  }, [title, area, address, contact, rent, pricePerNight, kind]);

  const submit = async () => {
    const suitability: ("family" | "bachelor" | "student" | "couple")[] = [];
    if (family) suitability.push("family");
    if (bachelor) suitability.push("bachelor");
    if (student) suitability.push("student");
    if (couple) suitability.push("couple");
    if (suitability.length === 0) suitability.push("family");

    await addListing({
      kind,
      title: title.trim(),
      type,
      area,
      address: address.trim(),
      rent: kind === "rent" ? Number(rent) : 0,
      advance: kind === "rent" && advance ? Number(advance) : undefined,
      pricePerNight: kind === "stay" ? Number(pricePerNight) : undefined,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      balconies: Number(balconies),
      drawing,
      dining,
      furnished,
      suitability,
      availableFrom: availableFrom || new Date().toISOString().slice(0, 10),
      description: description.trim() || "No description provided.",
      amenities,
      images: [0, 1, 3],
      contactNumber: contact.trim(),
      whatsapp: whatsapp.trim() || undefined,
      lat: 23.81 + (Math.random() - 0.5) * 0.04,
      lng: 90.41 + (Math.random() - 0.5) * 0.04,
      guestCapacity: kind === "stay" ? Number(guestCapacity) : undefined,
      minStay: kind === "stay" ? Number(minStay) : undefined,
      ownerName: user?.name ?? "You",
    });

    Alert.alert(
      "Submitted for review",
      "Your listing has been submitted. Our team will review it shortly before it goes live.",
      [{ text: "OK", onPress: () => router.back() }],
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 60 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Pressable
          onPress={() => setKind("rent")}
          style={{
            flex: 1,
            padding: 14,
            borderRadius: colors.radius,
            borderWidth: 1,
            borderColor: kind === "rent" ? colors.primary : colors.border,
            backgroundColor: kind === "rent" ? colors.primary : "transparent",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Feather
            name="home"
            size={18}
            color={kind === "rent" ? colors.primaryForeground : colors.foreground}
          />
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              color: kind === "rent" ? colors.primaryForeground : colors.foreground,
            }}
          >
            Long-term rental
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setKind("stay")}
          style={{
            flex: 1,
            padding: 14,
            borderRadius: colors.radius,
            borderWidth: 1,
            borderColor: kind === "stay" ? colors.primary : colors.border,
            backgroundColor: kind === "stay" ? colors.primary : "transparent",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Feather
            name="moon"
            size={18}
            color={kind === "stay" ? colors.primaryForeground : colors.foreground}
          />
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              color: kind === "stay" ? colors.primaryForeground : colors.foreground,
            }}
          >
            Short stay
          </Text>
        </Pressable>
      </View>

      <Field label="Property title">
        <Input placeholder="e.g. 2-bed family flat near Dhanmondi 27" value={title} onChangeText={setTitle} />
      </Field>

      <Field label="Property type">
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {(["flat", "room", "sublet", "house", "studio"] as const).map((t) => (
            <Chip
              key={t}
              label={t.charAt(0).toUpperCase() + t.slice(1)}
              active={type === t}
              onPress={() => setType(t)}
            />
          ))}
        </View>
      </Field>

      <Field label="Area">
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {DHAKA_AREAS.map((a) => (
            <Chip key={a} label={a} active={area === a} onPress={() => setArea(a)} />
          ))}
        </View>
      </Field>

      <Field label="Full address">
        <Input
          placeholder="House, road, neighborhood"
          value={address}
          onChangeText={setAddress}
          leftIcon="map-pin"
        />
      </Field>

      {kind === "rent" ? (
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Field label="Rent (৳ / month)">
              <Input placeholder="20000" value={rent} onChangeText={setRent} keyboardType="numeric" />
            </Field>
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Advance (৳)">
              <Input placeholder="40000" value={advance} onChangeText={setAdvance} keyboardType="numeric" />
            </Field>
          </View>
        </View>
      ) : (
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Field label="Price / night (৳)">
              <Input placeholder="3500" value={pricePerNight} onChangeText={setPricePerNight} keyboardType="numeric" />
            </Field>
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Min stay (nights)">
              <Input placeholder="1" value={minStay} onChangeText={setMinStay} keyboardType="numeric" />
            </Field>
          </View>
        </View>
      )}

      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Field label="Bedrooms">
            <Input value={bedrooms} onChangeText={setBedrooms} keyboardType="numeric" />
          </Field>
        </View>
        <View style={{ flex: 1 }}>
          <Field label="Bathrooms">
            <Input value={bathrooms} onChangeText={setBathrooms} keyboardType="numeric" />
          </Field>
        </View>
        <View style={{ flex: 1 }}>
          <Field label="Balconies">
            <Input value={balconies} onChangeText={setBalconies} keyboardType="numeric" />
          </Field>
        </View>
      </View>

      {kind === "stay" ? (
        <Field label="Guest capacity">
          <Input value={guestCapacity} onChangeText={setGuestCapacity} keyboardType="numeric" />
        </Field>
      ) : null}

      <Field label="Rooms">
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <Chip label="Drawing" active={drawing} onPress={() => setDrawing((v) => !v)} />
          <Chip label="Dining" active={dining} onPress={() => setDining((v) => !v)} />
          <Chip label="Furnished" active={furnished} onPress={() => setFurnished((v) => !v)} />
        </View>
      </Field>

      <Field label="Suitable for">
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <Chip label="Family" active={family} onPress={() => setFamily((v) => !v)} />
          <Chip label="Bachelor" active={bachelor} onPress={() => setBachelor((v) => !v)} />
          <Chip label="Student" active={student} onPress={() => setStudent((v) => !v)} />
          <Chip label="Couple" active={couple} onPress={() => setCouple((v) => !v)} />
        </View>
      </Field>

      <Field label="Amenities">
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {amenityOptions.map((a) => {
            const on = amenities.includes(a);
            return (
              <Chip
                key={a}
                label={a}
                active={on}
                onPress={() =>
                  setAmenities((cur) =>
                    on ? cur.filter((x) => x !== a) : [...cur, a],
                  )
                }
              />
            );
          })}
        </View>
      </Field>

      <Field label="Available from">
        <Input
          placeholder="YYYY-MM-DD"
          value={availableFrom}
          onChangeText={setAvailableFrom}
          leftIcon="calendar"
        />
      </Field>

      <Field label="Description">
        <Input
          placeholder="What makes this place special?"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          containerStyle={{ minHeight: 100, alignItems: "flex-start", paddingTop: 8 }}
          style={{ minHeight: 80, textAlignVertical: "top" }}
        />
      </Field>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Field label="Contact number">
            <Input
              placeholder="+8801…"
              value={contact}
              onChangeText={setContact}
              keyboardType="phone-pad"
              leftIcon="phone"
            />
          </Field>
        </View>
        <View style={{ flex: 1 }}>
          <Field label="WhatsApp (optional)">
            <Input
              placeholder="+8801…"
              value={whatsapp}
              onChangeText={setWhatsapp}
              keyboardType="phone-pad"
              leftIcon="message-circle"
            />
          </Field>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          padding: 12,
          borderRadius: colors.radius,
          backgroundColor: colors.muted,
        }}
      >
        <Feather name="info" size={16} color={colors.foreground} />
        <Text style={{ flex: 1, fontFamily: "Inter_500Medium", fontSize: 12, color: colors.foreground }}>
          Listings are reviewed by the Thikana team for trust and quality before being published.
        </Text>
      </View>

      <Button label="Submit for review" icon="check" onPress={submit} disabled={!valid} fullWidth />
    </ScrollView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const colors = useColors();
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 13, color: colors.foreground }}>{label}</Text>
      {children}
    </View>
  );
}
