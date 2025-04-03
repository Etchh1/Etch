import { device, element, by, expect } from 'detox';

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show home screen with greeting', async () => {
    await expect(element(by.text('Good morning!'))).toBeVisible();
  });

  it('should show primary and secondary buttons', async () => {
    await expect(element(by.text('Primary Action'))).toBeVisible();
    await expect(element(by.text('Secondary Action'))).toBeVisible();
  });

  it('should navigate to details screen when primary button is pressed', async () => {
    await element(by.text('Primary Action')).tap();
    await expect(element(by.text('Details Screen'))).toBeVisible();
  });
});
