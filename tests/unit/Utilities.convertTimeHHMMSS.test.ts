import Utilities from "@/libraries/helper/Utilities";

describe("utilities.convertTimeHHMMSS", () => {
  it("equals to 0", () => {
    expect.assertions(1);

    const time = Utilities.convertTimeHHMMSS(0);

    expect(time).toStrictEqual("0:00");
  });

  it("smaller than 1min", () => {
    expect.assertions(1);

    const time = Utilities.convertTimeHHMMSS(59);

    expect(time).toStrictEqual("0:59");
  });

  it("equals to 1min", () => {
    expect.assertions(1);

    const time = Utilities.convertTimeHHMMSS(60);

    expect(time).toStrictEqual("1:00");
  });

  it("greater than 1min", () => {
    expect.assertions(1);

    const time = Utilities.convertTimeHHMMSS(108);

    expect(time).toStrictEqual("1:48");
  });

  it("1:59", () => {
    expect.assertions(1);

    const time = Utilities.convertTimeHHMMSS(119);

    expect(time).toStrictEqual("1:59");
  });

  it("smaller than 1 hour", () => {
    expect.assertions(1);

    const time = Utilities.convertTimeHHMMSS(3600 - 1);

    expect(time).toStrictEqual("59:59");
  });

  it("equals to 1 hour", () => {
    expect.assertions(1);

    const time = Utilities.convertTimeHHMMSS(3600);

    expect(time).toStrictEqual("1:00:00");
  });

  it("greater than 1 hour", () => {
    expect.assertions(1);

    const time = Utilities.convertTimeHHMMSS(3600 + 1);

    expect(time).toStrictEqual("1:00:01");
  });

  it("smaller than 24 hour", () => {
    expect.assertions(1);

    const time = Utilities.convertTimeHHMMSS(86400 - 1);

    expect(time).toStrictEqual("23:59:59");
  });

  it("equals to 24 hour", () => {
    expect.assertions(1);

    const time = Utilities.convertTimeHHMMSS(86400);

    expect(time).toStrictEqual("24:00:00");
  });

  it("greater than 24 hour", () => {
    expect.assertions(1);

    const time = Utilities.convertTimeHHMMSS(86400 + 1);

    expect(time).toStrictEqual("24:00:01");
  });

  it("equals to undefined", () => {
    expect.assertions(1);

    const time = Utilities.convertTimeHHMMSS(undefined);

    expect(time).toStrictEqual("");
  });

  it("invalid value", () => {
    expect.assertions(1);

    const time = Utilities.convertTimeHHMMSS(("test" as unknown) as number);

    expect(time).toStrictEqual("N/A");
  });
});
