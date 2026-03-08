import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { transporter } from "@/lib/mailer";

const HOTEL_NAME = "Hotel New Ganga";
const HOTEL_PHONE = "+91-XXXXXXXXXX";
const HOTEL_EMAIL = process.env.EMAIL_USER || "info@hotelnewganga.com";
const HOTEL_ADDRESS = "3rd & 4th Floor, Kaiser Commercial Complex, Below Bhangagarh Bridge, GS Road, Guwahati - 781005, Assam";
const BRAND_COLOR = "#C19A5B";
const DARK_COLOR = "#1A2834";

function buildConfirmationEmail(booking: {
  guest_name: string;
  guest_email: string;
  room_category: string;
  check_in: string;
  check_out: string;
  booking_ref?: string;
}) {
  const checkIn = new Date(booking.check_in).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const checkOut = new Date(booking.check_out).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const bookingRef = booking.booking_ref || `HNG-${Date.now().toString().slice(-6)}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmed — ${HOTEL_NAME}</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:40px 0;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 6px 30px rgba(0,0,0,0.10);">

        <!-- Header -->
        <tr>
          <td style="background:${DARK_COLOR};padding:36px 40px 28px;text-align:center;">
            <h1 style="margin:0 0 4px;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:0.5px;">${HOTEL_NAME}</h1>
            <p style="margin:0;color:${BRAND_COLOR};font-size:12px;letter-spacing:1.5px;text-transform:uppercase;">Guwahati, Assam</p>
          </td>
        </tr>

        <!-- Confirmation Banner -->
        <tr>
          <td style="background:${BRAND_COLOR};padding:0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:20px 40px;text-align:center;">
                  <p style="margin:0;font-size:22px;color:#fff;font-weight:700;">✅ Booking Confirmed!</p>
                  <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.85);">Reference: <strong>${bookingRef}</strong></p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:32px 40px 0;">
            <p style="margin:0;font-size:16px;color:${DARK_COLOR};line-height:1.6;">
              Dear <strong>${booking.guest_name}</strong>,<br /><br />
              We are delighted to confirm your reservation at <strong>${HOTEL_NAME}</strong>. Your stay has been successfully booked and we look forward to welcoming you.
            </p>
          </td>
        </tr>

        <!-- Booking Details Box -->
        <tr>
          <td style="padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f5ef;border-radius:10px;border:1px solid #f0e0bc;overflow:hidden;">
              <tr>
                <td style="padding:18px 24px;border-bottom:1px solid #f0e0bc;">
                  <p style="margin:0;font-size:12px;font-weight:700;color:${BRAND_COLOR};text-transform:uppercase;letter-spacing:1px;">Booking Details</p>
                </td>
              </tr>
              <tr>
                <td style="padding:0 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:14px 0;border-bottom:1px solid #ece3d4;width:45%;">
                        <p style="margin:0;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Room Type</p>
                        <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:${DARK_COLOR};">${booking.room_category}</p>
                      </td>
                      <td style="padding:14px 0;border-bottom:1px solid #ece3d4;">
                        <p style="margin:0;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Booking Ref</p>
                        <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:${DARK_COLOR};">${bookingRef}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:14px 0;border-bottom:1px solid #ece3d4;">
                        <p style="margin:0;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Check-In</p>
                        <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:${DARK_COLOR};">${checkIn}</p>
                        <p style="margin:2px 0 0;font-size:12px;color:#888;">From 12:00 PM</p>
                      </td>
                      <td style="padding:14px 0;border-bottom:1px solid #ece3d4;">
                        <p style="margin:0;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Check-Out</p>
                        <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:${DARK_COLOR};">${checkOut}</p>
                        <p style="margin:2px 0 0;font-size:12px;color:#888;">By 11:00 AM</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Info Note -->
        <tr>
          <td style="padding:0 40px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#eef6ff;border-left:4px solid #3b82f6;border-radius:6px;padding:14px 18px;">
              <tr>
                <td style="padding:14px 18px;">
                  <p style="margin:0;font-size:13px;color:#1e40af;line-height:1.6;">
                    📋 Please carry a valid <strong>Government-issued photo ID</strong> at check-in. Our team is available 24/7 to assist you during your stay.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Contact Section -->
        <tr>
          <td style="padding:0 40px 32px;">
            <p style="margin:0 0 12px;font-size:14px;color:#444;line-height:1.6;">
              For any queries or special requests, please don't hesitate to contact us:
            </p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:6px 16px 6px 0;font-size:13px;color:#555;">📞 ${HOTEL_PHONE}</td>
                <td style="padding:6px 0;font-size:13px;color:#555;">✉️ ${HOTEL_EMAIL}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding:6px 0;font-size:13px;color:#555;">📍 ${HOTEL_ADDRESS}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="padding:0 40px;">
            <hr style="border:none;border-top:1px solid #eee;margin:0;" />
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px;text-align:center;background:#fafafa;">
            <p style="margin:0 0 6px;font-size:12px;color:#aaa;">
              This is an automated confirmation from <strong style="color:#666;">${HOTEL_NAME}</strong>.
            </p>
            <p style="margin:0;font-size:11px;color:#bbb;">
              Automatic Mail Delivery System powered by <strong style="color:#888;">Geny PMS</strong> — a unit of <strong style="color:#888;">MediaGeny</strong>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json({ error: "bookingId is required" }, { status: 400 });
    }

    // 1. Fetch booking details
    const { data: booking, error: fetchError } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // 2. Update booking status to confirmed
    const { error: updateError } = await supabaseAdmin
      .from("bookings")
      .update({ status: "confirmed" })
      .eq("id", bookingId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // 3. Send confirmation email to guest
    if (booking.guest_email) {
      const html = buildConfirmationEmail({
        guest_name: booking.guest_name,
        guest_email: booking.guest_email,
        room_category: booking.room_category,
        check_in: booking.check_in,
        check_out: booking.check_out,
        booking_ref: `HNG-${booking.id.slice(0, 8).toUpperCase()}`,
      });

      await transporter.sendMail({
        from: `"${HOTEL_NAME}" <${process.env.EMAIL_USER}>`,
        to: booking.guest_email,
        subject: `✅ Booking Confirmed — ${HOTEL_NAME} | Ref: HNG-${booking.id.slice(0, 8).toUpperCase()}`,
        html,
      });
    }

    return NextResponse.json({ success: true, message: `Booking confirmed and email sent to ${booking.guest_email}` });
  } catch (err) {
    console.error("Confirm booking error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
