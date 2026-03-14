import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib import rcParams

# Set font to support Chinese
rcParams['font.sans-serif'] = ['Arial Unicode MS', 'PingFang HK', 'Heiti TC', 'Microsoft YaHei', 'SimHei', 'sans-serif']
rcParams['axes.unicode_minus'] = False

def draw_rag_flowchart():
    fig, ax = plt.subplots(figsize=(12, 8))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 10)
    ax.axis('off')

    # Define box styles
    box_style = dict(boxstyle="round,pad=0.5", fc="white", ec="black", lw=1.5)
    process_style = dict(boxstyle="round,pad=0.5", fc="#e6f2ff", ec="#0066cc", lw=1.5)
    data_style = dict(boxstyle="round,pad=0.5", fc="#fff2cc", ec="#d6b656", lw=1.5)
    llm_style = dict(boxstyle="round,pad=0.5", fc="#d5e8d4", ec="#82b366", lw=1.5)

    # Draw nodes
    # User Input
    ax.text(2, 9, "User Question\n(用户提问)", ha="center", va="center", size=10, bbox=box_style)
    
    # Knowledge Base
    ax.text(10, 9, "Knowledge Base\n(JSON Data)", ha="center", va="center", size=10, bbox=data_style)
    
    # Retrieval System
    ax.text(6, 7, "Retrieval System\n(检索系统)", ha="center", va="center", size=12, weight="bold", bbox=process_style)
    
    # Scoring Details (inside Retrieval)
    ax.text(6, 6.2, "Keyword Matching & Scoring:\n- Title (+10)\n- Keywords (+5)\n- Content (+3)\n- Category (+2)", 
            ha="center", va="top", size=8, style="italic")

    # Context Construction
    ax.text(6, 4, "Context Construction\n(上下文构建)", ha="center", va="center", size=10, bbox=process_style)

    # Prompt Engineering
    ax.text(6, 2.5, "Prompt Engineering\n(提示词工程)", ha="center", va="center", size=10, bbox=process_style)

    # LLM
    ax.text(10, 2.5, "LLM (DeepSeek/Gemini)\n(大模型生成)", ha="center", va="center", size=10, bbox=llm_style)

    # Final Output
    ax.text(2, 2.5, "Final Answer\n(最终回答)", ha="center", va="center", size=10, bbox=box_style)

    # Draw arrows
    # User -> Retrieval
    ax.annotate("", xy=(6, 7.6), xytext=(2, 8.5), arrowprops=dict(arrowstyle="->", lw=1.5))
    # Knowledge Base -> Retrieval
    ax.annotate("", xy=(6, 7.6), xytext=(10, 8.5), arrowprops=dict(arrowstyle="->", lw=1.5))
    # Retrieval -> Context
    ax.annotate("", xy=(6, 4.6), xytext=(6, 6.4), arrowprops=dict(arrowstyle="->", lw=1.5))
    # Context -> Prompt
    ax.annotate("", xy=(6, 3.1), xytext=(6, 3.4), arrowprops=dict(arrowstyle="->", lw=1.5))
    # User -> Prompt (Direct connection for question)
    ax.annotate("", xy=(5, 2.5), xytext=(2, 8.4), arrowprops=dict(arrowstyle="->", lw=1.5, connectionstyle="arc3,rad=-0.3", ls="--"))
    # Prompt -> LLM
    ax.annotate("", xy=(8.8, 2.5), xytext=(7.2, 2.5), arrowprops=dict(arrowstyle="->", lw=1.5))
    # LLM -> Output
    ax.annotate("", xy=(3.2, 2.5), xytext=(8.8, 2.1), arrowprops=dict(arrowstyle="->", lw=1.5, connectionstyle="arc3,rad=0.2"))

    plt.title("RAG Implementation Flowchart (Keyword-based)", fontsize=14, pad=20)
    plt.tight_layout()
    plt.savefig('rag_flowchart.png', dpi=300)
    print("Flowchart saved as rag_flowchart.png")

if __name__ == "__main__":
    draw_rag_flowchart()
