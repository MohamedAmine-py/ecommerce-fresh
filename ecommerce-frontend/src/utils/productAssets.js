const FALLBACKS = {
  cpu: "/hardware/fallback-cpu.svg",
  gpu: "/hardware/fallback-gpu.svg",
  ram: "/hardware/fallback-ram.svg",
  storage: "/hardware/fallback-storage.svg",
  pc: "/hardware/fallback-pc.svg",
  peripheral: "/hardware/fallback-peripheral.svg",
  accessory: "/hardware/fallback-accessory.svg",
};

const includesAny = (value, terms) => terms.some((term) => value.includes(term));

// These are audited photographs for custom Elite PC systems. The original
// seeded URLs are not used directly because several are broken or depict a
// different kind of hardware. Exact named retail products intentionally fall
// back until a trustworthy photograph of that model is supplied locally.
const PRODUCT_PHOTOS = {
  "slayer-x gaming desktop": "/categories/gamer-pcs.webp",
  "phantom-z system": "/products/phantom-z-system.webp",
  "nova strike esports build": "/products/nova-strike-esports.webp",
  "titanws pro studio": "/categories/workstations.webp",
  "creator-7 master": "/products/creator-7-master.webp",
  "nvidia geforce rtx 4090 founders edition": "/products/rtx-4090.webp",
  "intel core i9-14900k": "/products/intel-i9-14900k.webp",
  "corsair vengeance 32gb (2x16gb) ddr5-6000": "/products/corsair-vengeance-ddr5.webp",
  "samsung 990 pro 2tb nvme ssd": "/products/samsung-990-pro.webp",
  "asus rog crosshair x670e hero": "/products/asus-x670e-motherboard.webp",
  "logitech g pro x superlight 2": "/products/logitech-superlight-mouse.webp",
  "steelseries arctis nova pro wireless": "/products/steelseries-headset.webp",
  "wooting 60he+ analog keyboard": "/products/wooting-keyboard.webp",
  "nzxt h9 elite dual-chamber case": "/products/nzxt-case.webp",
  "be quiet! dark power pro 13 1300w": "/products/dark-power-psu.webp",
  "corsair icue h150i elite lcd xt aio": "/products/corsair-aio.webp",
};

export function productFallback(product = {}) {
  const name = String(product.nom || "").toLowerCase();
  const category = String(product.categorie?.nom || "").toLowerCase();

  if (product.is_custom_build || includesAny(name, ["desktop", "system", "workstation", "build"])) return FALLBACKS.pc;
  if (includesAny(name, ["mouse", "headset", "keyboard", "logitech", "steelseries", "wooting"]) || category.includes("peripheral")) return FALLBACKS.peripheral;
  if (includesAny(name, ["case", "power", "cooler", "aio", "nzxt"]) || category.includes("accessor")) return FALLBACKS.accessory;
  if (includesAny(name, ["ssd", "nvme", "storage"]) || product.storage_details) return FALLBACKS.storage;
  if (includesAny(name, ["memory", "ram", "ddr"]) || product.ram_details) return FALLBACKS.ram;
  if (includesAny(name, ["geforce", "radeon", "rtx", "graphics"]) || product.graphics_card) return FALLBACKS.gpu;
  if (includesAny(name, ["intel", "amd", "ryzen", "core i", "processor", "cpu"]) || product.processor) return FALLBACKS.cpu;

  return category.includes("component") ? FALLBACKS.cpu : FALLBACKS.pc;
}

export function productImage(product = {}) {
  const configured = String(product.image || "").trim();
  const isLocalAsset = configured.startsWith("/") || configured.startsWith("data:image/");
  if (isLocalAsset) return configured;

  const productName = String(product.nom || "").trim().toLowerCase();
  return PRODUCT_PHOTOS[productName] || productFallback(product);
}

const CATEGORY_IMAGES = {
  "gamer pcs": "/categories/gamer-pcs.webp",
  workstations: "/categories/workstations.webp",
  components: "/categories/components.webp",
  peripherals: "/categories/peripherals.webp",
  "pc accessories": "/categories/pc-accessories.webp",
};

export function categoryImage(category = {}) {
  return CATEGORY_IMAGES[String(category.nom || "").trim().toLowerCase()] || productFallback({ categorie: category });
}

export function applyProductFallback(event, product) {
  const image = event.currentTarget;
  image.onerror = null;
  image.src = productFallback(product);
  image.classList.add("is-fallback");
}
