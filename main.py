import discord
from discord import app_commands
from discord.ext import commands
import os
from dotenv import load_dotenv
import time

load_dotenv()


bot = commands.Bot(command_prefix=">", intents=discord.Intents.all())

def setTheMsg(msg):
    print(f"Setting the message to: {msg}")

    # Write the new message to a local file
    with open("msg.txt", "w") as file:
        file.write(msg)

@bot.event
async def on_ready():
    print("Logged in.")
    try:
        synced = await bot.tree.sync()
        print(f"Synced {len(synced)} command(s)")
    except Exception as e:
        print(e)
        
@bot.tree.command(name="setmsg")
@app_commands.describe(msg="The message.")
async def setmsg(interaction: discord.Interaction, msg: str):
	setTheMsg(msg)
	await interaction.response.send_message(f"Setting the msg to: {msg}")

'''
@bot.tree.command(name="bots")
@app_commands.describe()
async def bots(interaction: discord.Interaction):
'''


token = os.getenv('KEY')

bot.run(token)