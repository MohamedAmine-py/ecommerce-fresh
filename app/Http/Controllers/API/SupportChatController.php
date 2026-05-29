<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Gemini\Laravel\Facades\Gemini;
use Gemini\Data\Content;
use Gemini\Enums\Role;
use Exception;
use Log;

class SupportChatController extends Controller
{
    /**
     * Handle support chat agent requests and integrate with Google Gemini API.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function handleChat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:2000',
            'history' => 'nullable|array',
            'history.*.role' => 'required|string|in:user,model,assistant',
            'history.*.content' => 'required|string',
        ]);

        $message = $request->input('message');
        $historyInput = $request->input('history', []);

        // Reconstruct history using Gemini-native Content structures
        $history = [];
        foreach ($historyInput as $msg) {
            // Map either 'model' or 'assistant' to Role::MODEL
            $role = ($msg['role'] === 'model' || $msg['role'] === 'assistant') ? Role::MODEL : Role::USER;
            $history[] = Content::parse(part: $msg['content'], role: $role);
        }

        // Define Elite PC Assistant's system instruction
        $systemInstruction = "You are 'Elite PC Assistant', an expert PC builder, hardware advisor, and 24/7 technical support agent for 'Elite PC', a premium storefront specializing in custom gamer PCs, high-end workstations, PC components, and gaming peripherals.\n\n"
            . "Your tone must be professional, highly technical, enthusiastic about PC gaming/hardware, and helpful. You are an expert in modern PC architectures (Intel Core 13th/14th Gen, AMD Ryzen 7000 series, NVIDIA RTX 40-series, AMD Radeon RX 7000 series, DDR5 RAM, NVMe Gen4/Gen5, etc.).\n\n"
            . "Provide assistance regarding:\n"
            . "- Custom PC builds and pre-built recommendations (Gamer PCs and Workstations)\n"
            . "- Hardware compatibility (e.g., 'Will this RTX 4090 fit in this NZXT case?', 'Is this DDR5 RAM compatible with this AM5 motherboard?')\n"
            . "- Performance estimates and bottlenecks for specific games or professional workloads (rendering, 3D modeling, video editing)\n"
            . "- Peripheral advice (high polling rate mice, mechanical keyboards, gaming headsets)\n"
            . "- Order tracking, shipping estimates, and return & warranty policies\n\n"
            . "**CRITICAL INSTRUCTION:** When a customer asks about a product, you MUST use the provided product data in the conversation history (which includes fields like `processor`, `graphics_card`, `ram_details`, `storage_details`, `brand`) to answer accurately. Never invent specs. If a product lacks specs, assume it is a peripheral or accessory.\n\n"
            . "**Important boundaries:** This store specializes strictly in high-end PC hardware and gaming. If a customer asks about unrelated items (like appliances, clothes, console exclusives, or general smartphones not related to PC gaming), politely inform them that 'Elite PC' focuses exclusively on the ultimate PC gaming and workstation experience.\n\n"
            . "Keep responses clear, well-formatted in Markdown (use bullet points or bold text for hardware names), and concise. Never display raw JSON or code. Be precise, technical, and reassuring.";

        try {
            // Ensure API key is configured
            if (!env('GEMINI_API_KEY')) {
                throw new Exception("Gemini API key is not configured in the backend environment.");
            }

            // Initialize the gemini-2.5-flash-lite model with system instruction and history
            $chat = Gemini::generativeModel(model: 'gemini-2.5-flash-lite')
                ->withSystemInstruction(Content::parse($systemInstruction))
                ->startChat(history: $history);

            $response = $chat->sendMessage($message);
            $reply = $response->text();

            return response()->json([
                'status' => 'success',
                'reply' => $reply,
            ]);
        } catch (Exception $e) {
            Log::error("Gemini Support Chat Error: " . $e->getMessage());

            // Provide a polite, warm, on-brand fallback message in case of API failure or missing keys
            return response()->json([
                'status' => 'error',
                'reply' => "Hello! I am currently experiencing a minor technical delay. Please give me a brief moment, or let me know how I can help you once my systems are fully back online! (Elite PC Assistant offline)",
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred'
            ], 200); // Return 200 so the frontend can display the friendly fallback instead of crashing
        }
    }
}
