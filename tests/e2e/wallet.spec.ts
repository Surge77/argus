import { expect, test } from "@playwright/test";

// Bitcoin is keyless (Blockstream), so these data-dependent flows pass in CI without secrets.
const BTC = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";

test("landing shows the search box", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /see any wallet/i })).toBeVisible();
  await expect(page.getByLabel("Wallet address")).toBeVisible();
});

test("invalid address shows a validation error", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Wallet address").fill("not-an-address");
  await page.getByRole("button", { name: "View" }).click();
  await expect(page.getByText(/Enter a valid/i)).toBeVisible();
  await expect(page).toHaveURL("/");
});

test("valid BTC address renders the dashboard", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Wallet address").fill(BTC);
  await page.getByRole("button", { name: "View" }).click();
  await expect(page).toHaveURL(new RegExp(BTC));
  await expect(page.getByText("Wallet dashboard")).toBeVisible();
  await expect(page.getByText("BTC", { exact: true }).first()).toBeVisible();
});

test("dashboard exposes share and chart period controls", async ({ page }) => {
  await page.goto(`/${BTC}`);
  await expect(page.getByRole("button", { name: /share/i })).toBeVisible();
  await page.getByRole("button", { name: "90d" }).click();
  await expect(page.getByRole("button", { name: "90d" })).toBeVisible();
});

test("tracked wallet appears on the landing page with a chain filter", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Wallet address").fill(BTC);
  await page.getByRole("button", { name: "View" }).click();
  await expect(page).toHaveURL(new RegExp(BTC));

  await page.goto("/");
  await expect(page.getByText("Your wallets")).toBeVisible();
  await page.getByRole("button", { name: "BTC" }).click();
  await expect(page.getByText("Your wallets")).toBeVisible();
});
